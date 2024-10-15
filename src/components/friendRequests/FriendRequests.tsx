"use client"

import { useState } from 'react'
import { SelectFriendRequest } from "@/server/db/schema";

export default function FriendRequests( {data} : {data: SelectFriendRequest[]}) {
    return (
        <div className='mt-4 p-3'>
            {data && data.length > 0 ? data.map((friendRequest) => (
                <div key={friendRequest.id}>
                    <p>{friendRequest.sender}</p>
                    <p>{friendRequest.recipient}</p>
                    <p>{friendRequest.status}</p>
                </div>
            )) : <p>No friend requests</p>}
        </div>
    );
}