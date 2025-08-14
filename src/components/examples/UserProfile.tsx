"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateUserProfile, fetchAdminClients } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const { user, role, clients, isLoading } = useAppSelector(
    (state: any) => state.auth
  );

  const handleUpdateProfile = () => {
    if (user) {
      dispatch(
        updateUserProfile({
          firstName: "Updated First Name",
          lastName: "Updated Last Name",
        })
      );
    }
  };

  const handleFetchClients = () => {
    if (role === "admin") {
      dispatch(fetchAdminClients());
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {user && (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Phone Verified:</strong>{" "}
            {user.isPhoneVerified ? "Yes" : "No"}
          </p>

          {role === "admin" && (
            <div>
              <p>
                <strong>Clients:</strong> {clients.length}
              </p>
              <Button onClick={handleFetchClients} className="mt-2">
                Refresh Clients
              </Button>
            </div>
          )}

          {role === "client" && user.assignedAdminId && (
            <p>
              <strong>Assigned Admin:</strong> {user.assignedAdminId}
            </p>
          )}
        </div>
      )}

      <Button onClick={handleUpdateProfile} className="mt-4">
        Update Profile
      </Button>
    </div>
  );
}
