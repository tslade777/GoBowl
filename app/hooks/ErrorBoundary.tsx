import React, { Component, ReactNode } from "react";
import { View, Text, Button } from "react-native";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ color: "red", fontSize: 18 }}>Something went wrong!</Text>
          <Text>{this.state.error?.message}</Text>
          <Button title="Restart App" onPress={() => this.setState({ hasError: false, error: null })} />
        </View>
      );
    }

    // Ensure we always return a valid ReactNode
    return this.props.children || null;
  }
}

export default ErrorBoundary;
