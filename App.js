import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, Pressable, TextInput, StyleSheet, Switch, Alert
} from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const THEME_KEY = 'pref:dark';

const palette = {
  dark: { bg: '#0b0b0f', card: '#11131a', text: '#f5f5f5', border: '#222' },
  light:{ bg: '#ffffff', card: '#ffffff', text: '#111111', border: '#ddd' },
};

/* ---------------- Screens ---------------- */
function HomeScreen({ navigation, route }) {
  const { dark } = route.params; // 親から受け取る
  const theme = dark ? palette.dark : palette.light;

  const [name, setName] = useState('Kosuke');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('name');
      if (saved) setName(saved);
    })();
  }, []);

  const onChange = async (text) => {
    setName(text);
    await AsyncStorage.setItem('name', text);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={styles.box}>
        <Text style={[styles.title, { color: theme.text }]}>Hello, {name}!</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, backgroundColor: dark ? '#15151b' : '#fff', color: theme.text },
          ]}
          placeholder="Your name"
          placeholderTextColor={dark ? '#9aa' : '#666'}
          value={name}
          onChangeText={onChange}
        />
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Details', { name, dark })}>
          <Text style={styles.btnText}>詳細へ</Text>
        </Pressable>
      </View>
      <StatusBar style={dark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function DetailsScreen({ route, navigation }) {
  const { name, dark } = route.params ?? { name: 'Kosuke', dark: false };
  const theme = dark ? palette.dark : palette.light;
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={styles.box}>
        <Text style={[styles.title, { color: theme.text }]}>Details</Text>
        <Text style={{ fontSize: 18, color: theme.text }}>受け取った名前: {name}</Text>
        <Pressable style={[styles.btn, { backgroundColor: '#64748b' }]} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>戻る</Text>
        </Pressable>
      </View>
      <StatusBar style={dark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function SettingsScreen({ dark, setDark }) {
  const theme = dark ? palette.dark : palette.light;

  const clearName = async () => {
    await AsyncStorage.removeItem('name');
    Alert.alert('完了', '保存した名前を消しました');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={styles.box}>
        <Text style={[styles.title, { color: theme.text }]}>設定</Text>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, color: theme.text }}>ダークテーマ</Text>
          <Switch
            value={dark}
            onValueChange={async (v) => {
              setDark(v);
              await AsyncStorage.setItem(THEME_KEY, v ? '1' : '0');
            }}
          />
        </View>
        <Pressable style={[styles.btn, { backgroundColor: '#dc2626' }]} onPress={clearName}>
          <Text style={styles.btnText}>名前をリセット</Text>
        </Pressable>
      </View>
      <StatusBar style={dark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

/* ---------------- Navigators ---------------- */
function HomeStack({ route }) {
  const { dark } = route.params;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ dark }}
        options={{ title: 'ホーム' }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '詳細' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  // 起動時にユーザー設定を読み込む
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved != null) setDark(saved === '1');
    })();
  }, []);

  return (
    <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: route.name === '設定', // 設定タブはヘッダー表示
          tabBarActiveTintColor: '#4F46E5',
          tabBarStyle: { backgroundColor: dark ? palette.dark.card : palette.light.card },
          tabBarIcon: ({ color, size, focused }) => {
            const icon =
              route.name === 'ホーム'
                ? focused ? 'home' : 'home-outline'
                : focused ? 'settings' : 'settings-outline';
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="ホーム"
          component={HomeStack}
          initialParams={{ dark }}
          listeners={{ tabPress: () => {} }}
        />
        <Tab.Screen name="設定">
          {() => <SettingsScreen dark={dark} setDark={setDark} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  screen: { flex: 1 },
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  input: { width: '80%', padding: 12, borderRadius: 12, borderWidth: 1 },
  btn: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
