import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as screens from '../../screens';

type MainStackParamList = {
  RouteInput: undefined;
  RouteMap: undefined;
  LocationSearch: undefined;
};

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

const MainStackNav = createNativeStackNavigator<MainStackParamList>();
export const MainStack = () => {
  return (
    <MainStackNav.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <MainStackNav.Screen name="RouteInput" component={screens.RouteInput} />
      <MainStackNav.Screen name="RouteMap" component={screens.RouteMap} />
      <MainStackNav.Screen
        name="LocationSearch"
        component={screens.LocationSearch}
      />
    </MainStackNav.Navigator>
  );
};
