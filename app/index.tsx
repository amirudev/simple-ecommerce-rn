import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      login(email);
    } else {
      Alert.alert("Error", "Please enter email and password");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="bag-handle" size={48} color="#e94560" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View
              style={[
                styles.inputContainer,
                isEmailFocused && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={isEmailFocused ? "#e94560" : "#8b8b9e"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#8b8b9e"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>

            {/* Password Input */}
            <View
              style={[
                styles.inputContainer,
                isPasswordFocused && styles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={isPasswordFocused ? "#e94560" : "#8b8b9e"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8b8b9e"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8b8b9e"
                />
              </Pressable>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#e94560", "#c73659"]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "rgba(233, 69, 96, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(233, 69, 96, 0.3)",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#8b8b9e",
    letterSpacing: 0.3,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputContainerFocused: {
    borderColor: "rgba(233, 69, 96, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 28,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 14,
    color: "#e94560",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: "#e94560",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  dividerText: {
    fontSize: 13,
    color: "#8b8b9e",
    marginHorizontal: 16,
    letterSpacing: 0.3,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 48,
  },
  footerText: {
    fontSize: 15,
    color: "#8b8b9e",
  },
  signUpText: {
    fontSize: 15,
    color: "#e94560",
    fontWeight: "600",
  },
});
