const UnauthorizedPage = () => (
  <div className="h-screen flex items-center justify-center bg-red-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-gray-600">You do not have permission to access this page.</p>
    </div>
  </div>
);

export default UnauthorizedPage;
