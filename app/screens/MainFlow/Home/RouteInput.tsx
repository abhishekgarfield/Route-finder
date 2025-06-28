import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {MainStackScreenProps} from '../../../navigation/MainStack';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../store';
import Touchable from '../../../components/Touchable';
import {Screen} from '../../../components';
import {requestPermissions} from '../../../utils/PermissionHelper';

type NavigationProps = MainStackScreenProps<'RouteInput'>;
type StoreProps = ConnectedProps<typeof connector>;
type Props = NavigationProps & StoreProps;

function RouteInputScreen({
  navigation,
  route,
  endLocation,
  startLocation,
}: Props) {
  const handleConfirm = () => {
    if (startLocation && endLocation) {
      navigation.navigate('RouteMap', {startLocation, endLocation});
    } else {
      toast.show('Please select location.', {type: 'warning'});
    }
  };
  useEffect(() => {
    requestPermissions(['Location']).then(res => {});
  }, []);

  return (
    <Screen style={styles.container} safeAreaEdges={['top']}>
      <Text style={styles.title}>Plan Your Route</Text>

      <Touchable
        style={styles.locationBox}
        onPress={() =>
          navigation.navigate('LocationSearch', {isStartLocation: true})
        }>
        <Text style={styles.locationText}>
          {startLocation?.ADDRESS || 'Select Start Location'}
        </Text>
      </Touchable>

      <Touchable
        style={styles.locationBox}
        onPress={() =>
          navigation.navigate('LocationSearch', {isStartLocation: false})
        }>
        <Text style={styles.locationText}>
          {endLocation?.ADDRESS || 'Select End Location'}
        </Text>
      </Touchable>

      <Touchable style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm Route</Text>
      </Touchable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },
  locationBox: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#34495e',
  },
  confirmButton: {
    marginTop: 30,
    paddingVertical: 14,
    backgroundColor: '#2980b9',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const mapStateToProps = (state: RootState) => ({
  startLocation: state.home.startLocation,
  endLocation: state.home.endLocation,
});
const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
export const RouteInput = connector(RouteInputScreen);
