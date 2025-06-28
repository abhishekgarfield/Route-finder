import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {scale} from 'react-native-size-matters';
import {colors} from '../theme';
import Touchable from './Touchable';
import FastImage, {
  FastImageProps,
  ImageStyle,
  ResizeMode,
  Source,
} from '@d11/react-native-fast-image';
export type * from '@d11/react-native-fast-image';

interface imageSet {
  uri: string;
}

interface RNImageProps extends Omit<FastImageProps, 'style'> {
  singleClickPreview?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  source: Source;
  imageStyle?: ImageStyle | ImageStyle[];
  Loading?: boolean;
  defaultSource?: any;
  children?: React.ReactNode;
  resizeMode?: ResizeMode;
  hitSlop?: TouchableOpacityProps['hitSlop'];
  thumb?: Source;
  borderRadius?: number;
  scaleIn?: number;
  loaderColor?: string;
  imagesArr?: imageSet[];
  style?: StyleProp<ViewStyle>;
}

const RNImage: React.FC<RNImageProps> = ({
  singleClickPreview,
  onPress,
  onLongPress,
  source,
  style,
  imageStyle,
  Loading,
  defaultSource,
  children,
  resizeMode,
  hitSlop,
  thumb,
  borderRadius,
  loaderColor,
  imagesArr,
  scaleIn,
  ...rest
}) => {
  const [visible, setIsVisible] = useState(false);
  return (
    <Touchable
      scaleIn={scaleIn ?? 0.99}
      scaleOut={1}
      disabled={!singleClickPreview && !onPress}
      hitSlop={hitSlop ?? {top: 5, bottom: 5, left: 5, right: 5}}
      onLongPress={() => {
        if (onLongPress) {
          onLongPress();
        } else {
          source?.uri ? setIsVisible(true) : null;
        }
      }}
      onPress={
        singleClickPreview && source?.uri ? () => setIsVisible(true) : onPress
      }
      style={[$viewStyle, borderRadius ? {borderRadius} : undefined, style]}>
      <FastImage
        defaultSource={defaultSource}
        source={thumb ?? source}
        resizeMode={resizeMode ?? 'contain'}
        style={[$image, borderRadius ? {borderRadius} : undefined, imageStyle]}
        {...rest}
      />

      {Loading ? (
        <View style={$loader}>
          <ActivityIndicator color={loaderColor ?? colors.palette.secondary} />
        </View>
      ) : null}
      {source?.uri ? (
        <ImageView
          images={
            imagesArr ?? [
              {
                uri: source?.uri,
              },
            ]
          }
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      ) : null}
      {children ? children : null}
    </Touchable>
  );
};

export default RNImage;

const $viewStyle: StyleProp<ViewStyle> = {
  width: scale(30),
  height: scale(30),
};
const $image: StyleProp<ImageStyle> = {
  height: '100%',
  width: '100%',
};

const $loader: StyleProp<ViewStyle> = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
};
