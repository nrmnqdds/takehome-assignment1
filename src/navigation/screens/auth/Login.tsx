import { Text } from "@react-navigation/elements";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  showPassword: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

interface FieldTouched {
  email: boolean;
  password: boolean;
}

export function Login() {
  const [formState, setFormState] = useState<LoginFormState>({
    email: "",
    password: "",
    isLoading: false,
    showPassword: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<FieldTouched>({
    email: false,
    password: false,
  });

  const { login } = useAuth();
  const { navigate } = useNavigation();

  const updateFormField = (
    field: keyof LoginFormState,
    value: string | boolean,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const markFieldAsTouched = (field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (
    field: keyof ValidationErrors,
    value: string,
  ): string | undefined => {
    switch (field) {
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Email address is incomplete";
        }
        return undefined;

      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof ValidationErrors) => {
    markFieldAsTouched(field);
    const value = formState[field] as string;
    const error = validateField(field, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    (["email", "password"] as Array<keyof ValidationErrors>).forEach(
      (field) => {
        const error = validateField(field, formState[field] as string);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      },
    );

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    return isValid;
  };

  const handleLogin = async () => {
    const { email, password } = formState;

    // Validate all fields
    if (!validateAllFields()) {
      return;
    }

    updateFormField("isLoading", true);
    const result = await login({ email: email.trim(), password });
    updateFormField("isLoading", false);

    if (!result.success && result.error) {
      Alert.alert("Login Failed", result.error);
    }
    // Navigation will be handled automatically by the auth state change
  };

  const { email, password, isLoading, showPassword } = formState;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && errors.email && styles.inputError,
              ]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => updateFormField("email", value)}
              onBlur={() => handleBlur("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordContainer,
                touched.password && errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={(value) => {
                  updateFormField("password", value);
                  // Real-time validation for password as user types
                  if (value.length > 0 && value.length < 6) {
                    setErrors((prev) => ({
                      ...prev,
                      password: "Password must be at least 6 characters",
                    }));
                  } else if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                onBlur={() => handleBlur("password")}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => updateFormField("showPassword", !showPassword)}
              >
                <AntDesign
                  name={showPassword ? "eye" : "eye-invisible"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigate("Signup")}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#E53935",
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#E53935",
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
