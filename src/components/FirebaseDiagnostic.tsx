import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const FirebaseDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: any[] = [];

    // Test 1: Firebase App
    try {
      const { app } = await import('../lib/firebase');
      results.push({
        test: 'Firebase App',
        status: 'success',
        message: `App initialized: ${app.name}`,
        details: `Project ID: ${app.options.projectId}`
      });
    } catch (error: any) {
      results.push({
        test: 'Firebase App',
        status: 'error',
        message: 'Failed to initialize Firebase app',
        details: error.message
      });
    }

    // Test 2: Auth Instance
    try {
      results.push({
        test: 'Auth Instance',
        status: 'success',
        message: 'Auth instance created',
        details: `App: ${auth.app.name}`
      });
    } catch (error: any) {
      results.push({
        test: 'Auth Instance',
        status: 'error',
        message: 'Failed to create auth instance',
        details: error.message
      });
    }

    // Test 3: Auth Configuration
    try {
      const config = auth.config;
      results.push({
        test: 'Auth Configuration',
        status: 'success',
        message: 'Auth configuration loaded',
        details: `API Key: ${config.apiKey?.substring(0, 10)}...`
      });
    } catch (error: any) {
      results.push({
        test: 'Auth Configuration',
        status: 'error',
        message: 'Auth configuration not found',
        details: error.message
      });
    }

    // Test 4: Network Connection
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${auth.config.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test123' })
      });
      
      if (response.status === 400) {
        results.push({
          test: 'Network Connection',
          status: 'success',
          message: 'Firebase API accessible',
          details: 'API endpoint responding correctly'
        });
      } else {
        results.push({
          test: 'Network Connection',
          status: 'warning',
          message: 'Unexpected API response',
          details: `Status: ${response.status}`
        });
      }
    } catch (error: any) {
      results.push({
        test: 'Network Connection',
        status: 'error',
        message: 'Cannot reach Firebase API',
        details: error.message
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Firebase Diagnostic</h3>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          variant="outline"
        >
          {isRunning ? 'Running...' : 'Run Diagnostics'}
        </Button>
      </div>

      {diagnostics.length > 0 && (
        <div className="space-y-3">
          {diagnostics.map((diagnostic, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(diagnostic.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1">
                  <h4 className="font-medium">{diagnostic.test}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {diagnostic.message}
                  </p>
                  {diagnostic.details && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {diagnostic.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p><strong>Common Solutions:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Enable Firebase Authentication in Firebase Console</li>
          <li>Enable Email/Password sign-in method</li>
          <li>Check if you have access to the Firebase project</li>
          <li>Verify the project ID and API key are correct</li>
        </ul>
      </div>
    </Card>
  );
};
