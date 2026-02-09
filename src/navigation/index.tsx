import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, ActivityIndicator, View } from "react-native";
import bell from "@/assets/bell.png";
import newspaper from "@/assets/newspaper.png";
import { Home } from "@/navigation/screens/Home";
import { Profile } from "@/navigation/screens/Profile";
import { Settings } from "@/navigation/screens/Settings";
import { Updates } from "@/navigation/screens/Updates";
import { NotFound } from "@/navigation/screens/NotFound";
import { Login } from "@/navigation/screens/auth/Login";
import { Signup } from "@/navigation/screens/auth/Signup";
import { useAuth } from "@/context/AuthContext";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Feed",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Updates: {
      screen: Updates,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Image
            source={bell}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const AuthStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        title: "Login",
        headerShown: false,
      },
    },
    Signup: {
      screen: Signup,
      options: {
        title: "Sign Up",
        headerShown: false,
      },
    },
  },
});

const MainStack = createNativeStackNavigator({
  screens: {
    Login: {
      if: () => !useAuth().user || false,
      screen: Login,
      options: {
        title: "Login",
        headerShown: false,
      },
    },
    Signup: {
      if: () => !useAuth().user || false,
      screen: Signup,
      options: {
        title: "Sign Up",
        headerShown: false,
      },
    },
    HomeTabs: {
      if: () => !!useAuth().user || false,
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    About: {
      screen: Settings,
      options: ({ navigation }) => ({
        // presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

const MainNavigation = createStaticNavigation(MainStack);

export function Navigation(props: React.ComponentProps<typeof MainNavigation>) {
  return <MainNavigation {...props} />;
}

type MainStackParamList = StaticParamList<typeof MainStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}
