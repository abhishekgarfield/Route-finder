import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import axios from 'axios';
import {MainStackScreenProps} from '../../../navigation/MainStack';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../store';
import {Screen} from '../../../components';
import {homeActions} from './slice';
import {debounce} from 'lodash';
import RNImage from '../../../components/Image';
import {images} from '../../../theme';
import Touchable from '../../../components/Touchable';

// Types
type NavigationProps = MainStackScreenProps<'LocationSearch'>;
type StoreProps = ConnectedProps<typeof connector>;
type Props = NavigationProps & StoreProps;

function LocationSearchScreen({
  navigation,
  route,
  setEndLocation,
  setStartLocation,
  startLocation,
  endLocation,
}: Props) {
  const [query, setQuery] = useState(
    route.params?.isStartLocation
      ? startLocation?.ADDRESS
      : endLocation?.ADDRESS,
  );
  const [results, setResults] = useState<any[]>([]);

  const searchLocation = async (text: string) => {
    if (!text) return setResults([]);
    try {
      const res = await axios.get(
        'https://www.onemap.gov.sg/api/common/elastic/search',
        {
          params: {
            searchVal: text,
            returnGeom: 'Y',
            getAddrDetails: 'Y',
            pageNum: 1,
          },
        },
      );
      setResults(res.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const debouncedSearch = useRef(
    debounce((text: string) => searchLocation(text), 500),
  ).current;

  const onChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    route.params?.isStartLocation
      ? setStartLocation(null)
      : setEndLocation(null);
    setQuery('');
    setResults([]);
  };

  const selectLocation = (item: any) => {
    route.params?.isStartLocation
      ? setStartLocation(item)
      : setEndLocation(item);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  return (
    <Screen preset="scroll" safeAreaEdges={['top']} style={styles.screen}>
      <View style={styles.headerRow}>
        <Touchable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <RNImage source={images.arrowLeft} />
        </Touchable>
        <Text style={styles.title}>Search Location</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          value={query}
          onChangeText={onChangeText}
          placeholder="Search for a location"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        {query?.length > 0 && (
          <Touchable style={styles.clearIcon} onPress={clearSearch}>
            <RNImage source={images.closeCircle} />
          </Touchable>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.SEARCHVAL + index}
        renderItem={({item}) => (
          <Touchable
            onPress={() => selectLocation(item)}
            style={styles.resultItem}>
            <Text style={styles.resultText}>{item.SEARCHVAL}</Text>
          </Touchable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found</Text>
        }
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
    padding: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    fontSize: 16,
    flexBasis: '90%',
  },
  clearIcon: {
    // position: 'absolute',
    // right: 10,
    alignItems: 'center',
    // top: '50%',
    // transform: [{translateY: -10}],
  },
  resultItem: {
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 1,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
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
export const LocationSearch = connector(LocationSearchScreen);
