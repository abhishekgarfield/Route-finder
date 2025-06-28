import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import axios from 'axios';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {MainStackScreenProps} from '../../../navigation/MainStack';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../store';
import RNImage from '../../../components/Image';
import {colors, images} from '../../../theme';
import {Screen} from '../../../components';
import Touchable from '../../../components/Touchable';
import {homeActions} from './slice';

type NavigationProps = MainStackScreenProps<'RouteMap'>;
type StoreProps = ConnectedProps<typeof connector>;
type Props = NavigationProps & StoreProps;

const RouteMapScreen = ({
  route,
  endLocation,
  setEndLocation,
  setStartLocation,
  startLocation,
  navigation,
}: Props) => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  const fetchRoutes = async (start, end) => {
    if (!start || !end) return;

    const startLng = parseFloat(start.LONGITUDE);
    const startLat = parseFloat(start.LATITUDE);
    const endLng = parseFloat(end.LONGITUDE);
    const endLat = parseFloat(end.LATITUDE);

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&alternatives=true`;

    try {
      setLoading(true);
      const res = await axios.get(url);
      if (res.data.code !== 'Ok') throw new Error('Invalid route response');
      setRoutes(res.data.routes);
    } catch (error) {
      console.error('Route fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes(startLocation, endLocation);
  }, [startLocation, endLocation]);

  const selectedRoute = routes[selectedRouteIndex];
  const coordinates =
    selectedRoute?.geometry?.coordinates?.map(
      ([lng, lat]: [number, number]) => ({latitude: lat, longitude: lng}),
    ) || [];

  useEffect(() => {
    if (coordinates.length && mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 300, bottom: 200, left: 50, right: 50},
        animated: true,
      });
    }
  }, [coordinates]);

  const swapLocations = () => {
    const temp = startLocation;
    setStartLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
  };

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={{flexGrow: 1}}
      safeAreaEdges={['top']}>
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <RNImage source={images.arrowLeft} style={{width: 24, height: 24}} />
        </Touchable>
        <View style={styles.locationInfoWrapper}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={styles.locationCard}>
              <Text style={styles.locationTitle}>From</Text>
              <Text style={styles.locationAddress}>
                {startLocation?.ADDRESS || 'Start'}
              </Text>
            </View>

            <View style={styles.locationCard}>
              <Text style={styles.locationTitle}>To</Text>
              <Text style={styles.locationAddress}>
                {endLocation?.ADDRESS || 'End'}
              </Text>
            </View>
          </View>
          <Touchable onPress={swapLocations} style={styles.swapButton}>
            <RNImage source={images.route} style={{width: 24, height: 24}} />
          </Touchable>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: parseFloat(startLocation.LATITUDE),
          longitude: parseFloat(startLocation.LONGITUDE),
          latitudeDelta: 0.095,
          longitudeDelta: 0.095,
        }}
        // showsMyLocationButton
      >
        <Polyline
          coordinates={coordinates}
          strokeWidth={5}
          strokeColor="#007Aaa"
          fillColor={colors.palette.linkColor}
        />
        <Marker
          pinColor={colors.palette.green}
          coordinate={{
            latitude: parseFloat(startLocation.LATITUDE),
            longitude: parseFloat(startLocation.LONGITUDE),
          }}
          title="Start"
        />
        <Marker
          coordinate={{
            latitude: parseFloat(endLocation.LATITUDE),
            longitude: parseFloat(endLocation.LONGITUDE),
          }}
          title="End"
        />
      </MapView>

      <BottomSheet enableDynamicSizing index={1} snapPoints={['25%']}>
        <BottomSheetView style={{marginBottom: 10}}>
          {loading ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator color={'red'} size={'small'} />
            </View>
          ) : (
            <FlatList
              data={routes}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({item, index}) => (
                <Touchable
                  onPress={() => setSelectedRouteIndex(index)}
                  style={[
                    styles.routeItem,
                    index === selectedRouteIndex && styles.selectedRouteItem,
                  ]}>
                  <Text style={styles.routeTitle}>Route {index + 1}</Text>
                  <Text style={styles.routeDetail}>
                    🚗 {Math.round(item.distance)} m
                  </Text>
                  <Text style={styles.routeDetail}>
                    ⏱ {Math.round(item.duration / 60)} mins
                  </Text>
                </Touchable>
              )}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
};

const styles = StyleSheet.create({
  map: {...StyleSheet.absoluteFillObject},
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  locationInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  locationCard: {
    // flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    marginTop: 4,
  },
  swapButton: {
    padding: 6,
  },
  locationTitle: {
    fontSize: 12,
    color: '#888',
  },
  locationAddress: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  routeItem: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomColor: '#eee',
    // borderBottomWidth: 1,
  },
  selectedRouteItem: {
    backgroundColor: '#e6f0ff',
  },
  routeTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  routeDetail: {
    fontSize: 14,
    color: '#333',
  },
});

const mapStateToProps = (state: RootState) => ({
  startLocation: state.home.startLocation,
  endLocation: state.home.endLocation,
});
const mapDispatch = {
  setStartLocation: startLocation =>
    homeActions.addStartLocation(startLocation),
  setEndLocation: endLocation => homeActions.addEndLocation(endLocation),
};
const connector = connect(mapStateToProps, mapDispatch);
export const RouteMap = connector(RouteMapScreen);
