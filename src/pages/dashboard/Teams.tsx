import { Users } from "lucide-react";

const Teams = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teams</h1>
        <p className="text-muted-foreground">Manage team members and collaborators</p>
      </div>
      
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-3xl">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Team management coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Teams;
