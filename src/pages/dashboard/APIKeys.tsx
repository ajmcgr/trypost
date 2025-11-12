import { Key } from "lucide-react";

const APIKeys = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys for integrations</p>
      </div>
      
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-3xl">
        <div className="text-center">
          <Key className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">API keys management coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default APIKeys;
