"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

async function sendFriendRequest(friendName: string, friendEmail:string, userId:string): Promise<any> {
    const res = await fetch(`/api/friends/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, friendEmail, friendName}),
    });

    if (!res.ok) {
        console.log("Results: ", res);
        throw new Error('Failed to send friend request');
    }
    return res.json();

}

export default function AddFriendForm() {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();


  // New touched state variables
  const [isFriendNameTouched, setIsFriendNameTouched] = useState(false);
  const [isFriendEmailTouched, setIsFriendEmailTouched] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation for email
  useEffect(() => {
    if (isFriendEmailTouched) {
      if (!friendEmail) {
        setEmailError("Email cannot be empty");
      } else if (!emailRegex.test(friendEmail)) {
        setEmailError("Please enter a valid email");
      } else {
        setEmailError(null);
      }
    }
  }, [friendEmail, isFriendEmailTouched]);

  // Real-time name validation and suggestion feature
  useEffect(() => {
    if (isFriendNameTouched) {
      if (friendName.length < 3) {
        setNameError("Name should be at least 3 characters");
        setSuggestions([]);
      } else {
        setNameError(null);
        fetchSuggestions(friendName);
      }
    }
  }, [friendName, isFriendNameTouched]);


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Connected to the WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchSuggestions = async (name: string) => {
    // Simulate fetching name suggestions (e.g., from an API)
    const fakeSuggestions = ["John Doe", "Jane Smith", "Jason Mraz"]; // Simulated data
    const filteredSuggestions = fakeSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(name.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setGeneralError("");

    // Set touched state to true for both fields
    setIsFriendNameTouched(true);
    setIsFriendEmailTouched(true);

    // Perform validation
    let isValid = true;
    if (friendName.length < 3) {
      setNameError("Name should be at least 3 characters");
      isValid = false;
    }
    if (!friendEmail) {
      setEmailError("Email cannot be empty");
      isValid = false;
    } else if (!emailRegex.test(friendEmail)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!isValid) {
      setGeneralError("Please fix the errors before submitting.");
      setLoading(false);
      return;
    }

    try {      
      const response = await sendFriendRequest(
        friendName,
        friendEmail,
        session?.user?.id || ""
      );
      if (response.success) {
        setSuccessMessage(response.message);
        
        // Optionally reset the form
        setFriendName("");
        setFriendEmail("");
        setSuggestions([]);
        setIsFriendNameTouched(false);
        setIsFriendEmailTouched(false);
      } else {
        setGeneralError(response.message);
      }
    } catch (error: any) {
      setGeneralError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <form
        className="flex flex-col gap-4"
        method="POST"
        onSubmit={onSubmit}
        noValidate
        aria-describedby="form-errors"
      >
        {/* Name Input */}
        <div className="mt-5 flex flex-col gap-1 relative">
          <label htmlFor="name-input" className="sr-only">
            Friend's Name
          </label>
          <input
            className={`border p-3 w-full ${
              nameError ? "border-red-500" : "border-black"
            }`}
            id="name-input"
            name="name"
            type="text"
            placeholder="Enter friend's name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            onBlur={() => setIsFriendNameTouched(true)}
            disabled={loading}
            aria-invalid={!!nameError}
            aria-describedby="name-error"
          />
          {nameError && (
            <p
              className="text-red-500 text-sm absolute bottom-[-20px]"
              id="name-error"
            >
              {nameError}
            </p>
          )}
          {/* Real-time suggestions */}
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 bg-white mt-1 absolute w-full z-10 max-h-40 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => {
                    setFriendName(suggestion);
                    setSuggestions([]);
                    setIsFriendNameTouched(true);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Email Input */}
        <div className="mt-5 flex flex-col gap-1 relative">
          <label htmlFor="email-input" className="sr-only">
            Friend's Email
          </label>
          <input
            className={`border p-3 w-full ${
              emailError ? "border-red-500" : "border-black"
            }`}
            id="email-input"
            name="email"
            type="email"
            placeholder="Enter friend's email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            onBlur={() => setIsFriendEmailTouched(true)}
            disabled={loading}
            aria-invalid={!!emailError}
            aria-describedby="email-error"
          />
          {emailError && (
            <p
              className="text-red-500 text-sm absolute bottom-[-20px]"
              id="email-error"
            >
              {emailError}
            </p>
          )}
        </div>

        {/* General Error Display */}
        {generalError && (
          <p
            className="text-red-500 text-sm mt-2"
            role="alert"
            id="form-errors"
          >
            {generalError}
          </p>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-sm mt-2" role="status">
            {successMessage}
          </p>
        )}

        {/* Submit Button */}
        <div className="mt-5">
          <button
            type="submit"
            className="border text-sm border-black p-2 min-w-[150px] hover:bg-black hover:text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Sending..." : "Add Friend"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Include your sendFriendRequest function as before