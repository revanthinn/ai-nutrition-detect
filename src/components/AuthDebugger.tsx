import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export const AuthDebugger = () => {
  const { user, firebaseUser, loading } = useFirebaseAuth();

  return (
    <Card className="p-4 space-y-2">
      <h4 className="font-semibold">Authentication Debug</h4>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span>Loading:</span>
          <Badge variant={loading ? "destructive" : "secondary"}>
            {loading ? "Yes" : "No"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Firebase User:</span>
          <Badge variant={firebaseUser ? "default" : "secondary"}>
            {firebaseUser ? "Logged In" : "Not Logged In"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>App User:</span>
          <Badge variant={user ? "default" : "secondary"}>
            {user ? "Logged In" : "Not Logged In"}
          </Badge>
        </div>
        {firebaseUser && (
          <div className="text-xs text-muted-foreground">
            Email: {firebaseUser.email}
          </div>
        )}
        {user && (
          <div className="text-xs text-muted-foreground">
            UID: {user.uid}
          </div>
        )}
      </div>
    </Card>
  );
};
