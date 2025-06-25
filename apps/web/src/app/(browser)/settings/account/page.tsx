import { DeleteAccountBtn } from "@/components/blocks/buttons/deleteAccountBtn";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";

const Page = async () => {
  const QUERY = gql`
    query MyQuery {
      me {
        email
        username
        registrationMethod
      }
    }
  `;
 
  const { data } = await createServerClient().query({ 
    query: QUERY,
  });
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Account Settings</h1>

      {/* Profile Information */}
      <section className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Username
          </label>
          <div className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white">
            <span>{data.me.username}</span> 
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Email
          </label>
          <div className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white">
            <div className="flex justify-between items-center">
              <span>{data.me.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-300">
            Login Methods
          </label>

          <div className="space-y-3">
            {/* Google Authentication */}
            <div className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.167-2.698-6.735-2.698-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.668-0.069-1.325-0.182-1.961h-9.818z" />
                  </svg>
                  <span>Google</span>
                </div>
                {data.me.registrationMethod.includes("google") ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      Connected
                    </span>
                  </div>
                ) : (
                  <button
                    className="text-sm text-blue-400 hover:text-blue-300"
                    // onClick={() => {
                    //   // Handle Google connect
                    // }}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {/* Email/Password Authentication */}
            <div className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                  </svg>
                  <span>Email & Password</span>
                </div>
                {data.me.registrationMethod.includes("email") ? (
                  <div className="flex items-center space-x-4">
                    <button
                      className="text-sm text-blue-400 hover:text-blue-300"
                      // onClick={() => {
                      //   // Handle password change
                      // }}
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      className="text-sm text-blue-400 hover:text-blue-300"
                      // onClick={() => {
                      //   // Handle email/password setup
                      // }}
                    >
                      Set up password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Warning message if only one method is connected */}
          {data.me.registrationMethod.length === 1 && (
            <p className="text-xs text-yellow-400">
              Warning: You only have one login method connected. Please add
              another method before disconnecting this one.
            </p>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 border border-red-500/30 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-red-300">
            Delete Account
          </label>
          <p className="text-sm text-neutral-400">
            Permanently remove your account and all associated data. This action
            cannot be undone.
          </p>
          <DeleteAccountBtn />
        </div>
      </section>
    </div>
  );
};

export default Page;
