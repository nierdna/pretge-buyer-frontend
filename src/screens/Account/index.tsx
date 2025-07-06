export default function AccountScreen() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-white">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-opensea-darkBorder rounded-lg shadow-md p-6 border border-opensea-darkBorder">
            <h2 className="text-xl font-semibold mb-4 text-white">Navigation</h2>
            <ul className="space-y-2">
              <li className="p-2 bg-opensea-blue/20 text-opensea-blue rounded-md">Profile</li>
              <li className="p-2 hover:bg-opensea-darkBlue rounded-md text-white">Orders</li>
              <li className="p-2 hover:bg-opensea-darkBlue rounded-md text-white">Addresses</li>
              <li className="p-2 hover:bg-opensea-darkBlue rounded-md text-white">
                Payment Methods
              </li>
              <li className="p-2 hover:bg-opensea-darkBlue rounded-md text-white">Notifications</li>
              <li className="p-2 hover:bg-opensea-darkBlue rounded-md text-white">Security</li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-opensea-darkBorder rounded-lg shadow-md p-6 border border-opensea-darkBorder">
            <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full border-opensea-darkBorder bg-opensea-darkBorder rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full border-opensea-darkBorder bg-opensea-darkBorder rounded-md text-white"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full border-opensea-darkBorder bg-opensea-darkBorder rounded-md text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full border-opensea-darkBorder bg-opensea-darkBorder rounded-md text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-opensea-blue text-white py-2 px-4 rounded-md hover:bg-opensea-blue/90 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
