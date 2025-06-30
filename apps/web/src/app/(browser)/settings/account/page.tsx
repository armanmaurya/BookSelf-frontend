import { DeleteAccountBtn } from "@/components/blocks/buttons/deleteAccountBtn";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaGoogle, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";

const Page = async () => {
  const QUERY = gql`
    query MyQuery {
      me {
        email
        username
        registrationMethods
      }
    }
  `;
 
  const { data } = await createServerClient().query({
    query: QUERY,
  });

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      {/* Profile Information */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={data.me.username} 
              readOnly 
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={data.me.email} 
              readOnly 
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Login Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Login Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <FaGoogle className="h-5 w-5" />
              <span>Google</span>
            </div>
            {data.me.registrationMethods.includes("google") ? (
              <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                Connected
              </Badge>
            ) : (
              <Button variant="outline" size="sm">
                Connect
              </Button>
            )}
          </div>

          {/* Email/Password Authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="h-5 w-5" />
              <span>Email & Password</span>
            </div>
            {data.me.registrationMethods.includes("email") ? (
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                Set up password
              </Button>
            )}
          </div>

          {data.me.registrationMethods.length === 1 && (
            <Alert variant="destructive">
              <FaExclamationTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: You only have one login method connected. Please add
                another method before disconnecting this one.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-destructive">Delete Account</Label>
            <p className="text-sm text-muted-foreground">
              Permanently remove your account and all associated data. This action
              cannot be undone.
            </p>
            <DeleteAccountBtn />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;