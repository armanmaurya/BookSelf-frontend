const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex flex-grow min-h-0 h-full space-x-2.5">
        <div className="w-80 bg-neutral-900 rounded-lg p-2">All Chat View</div>
        <div className="flex-grow bg-neutral-900 rounded-lg p-2">{children}</div>
      </div>
    );
  };
  
  export default Layout;
  