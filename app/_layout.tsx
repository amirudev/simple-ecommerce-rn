import { Stack, useRouter, useSegments } from "expo-router";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import "../constants/NetworkDebug";

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments() as any; // Cast to any to avoid strict type checking issues with empty segments
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure we don't run this logic before the layout is mounted
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Check if the user is trying to access a protected route
    // We consider everything protected except the root index (login)
    // segments is [] for the root index
    const isAtLogin = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');

    if (!isAuthenticated && !isAtLogin) {
      // If not authenticated and trying to access something other than login, redirect to login
      router.replace("/");
    } else if (isAuthenticated && isAtLogin) {
      // If authenticated and at login screen, redirect to catalog
      router.replace("/catalog");
    }
  }, [isAuthenticated, segments, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CartProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
