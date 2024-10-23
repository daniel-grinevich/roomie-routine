

async function deleteGroupById(groupId: number): Promise<void> {
    try {
        // Execute the delete query
        const result = await db
            .delete()
            .from(routineGroups)
            .where(eq(routineGroups.id, groupId));

        // Check if any rows were affected
        if (result.rowCount === 0) {
            throw new Error(`Group with ID ${groupId} not found.`);
        }

        console.log(`Group with ID ${groupId} deleted successfully.`);
    } catch (error) {
        console.error("Error when deleting group:", error);
        throw error; // Re-throw the error to be handled upstream
    }
}

// Example usage of deleteGroupById
async function handleDelete(groupId: number) {
    try {
        await deleteGroupById(groupId);
        // You might want to redirect or update your UI here after deletion
    } catch (error) {
        // Handle the error (e.g., notify the user)
        alert(error.message);
    }
}