import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uuid from 'uuid';

import Grid from './Grid';
import styled from 'styled-components';

const GridWrapper = styled(Grid)`
  margin: 0px 0px;
`;

const keyExtractor = () => uuid.v4();

export default class ImageGrid extends PureComponent {
  static propTypes = {
    onPressImage: PropTypes.func
  };

  static defaultProps = {
    onPressImage: url => {
      console.log('Go to url: ' + url);
    }
  };

  // eslint-disable-next-line react/sort-comp
  loading = false;
  cursor = null;

  state = {
    images: [
      {
        uri: require('../assets/uukanshu.gif'),
        url: 'http://sj.uukanshu.com',
        desc: 'UU Khán Thư'
      },
      { uri: require('../assets/66wx.gif'), url: 'http://m.66wx.com', desc: '66 Văn Học' },
      { uri: require('../assets/ranwen.gif'), url: 'http://m.ranwena.com/', desc: 'Nhiên Văn' },
      { uri: require('../assets/17k.png'), url: 'http://h5.17k.com/', desc: '17k' },
      { uri: require('../assets/jiujiu.png'), url: 'http://m.jjxsw.com/', desc: 'Txt99' }, //txt99
      { uri: require('../assets/80txt.png'), url: 'http://m.80txt.com/', desc: '80txt' }, //80txt
      { uri: require('../assets/tangiang.png'), url: 'http://wap.jjwxc.net/', desc: 'Tấn Giang' },
      { uri: require('../assets/kanunu8.png'), url: 'http://www.kanunu8.com/', desc: 'Nỗ nỗ' }
    ]
  };

  renderItem = ({ item: { uri, url, desc }, size, marginTop, marginLeft }) => {
    const { onPressImage } = this.props;

    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop,
      borderWidth: 1,
      borderColor: '#666',
      borderRadius: 5,
      padding: 5
    };

    return (
      <TouchableOpacity
        key={uuid.v4()}
        activeOpacity={0.75}
        onPress={() => onPressImage(url)}
        style={style}
      >
        {!!uri && <Image source={uri} style={styles.image} />}
        {!!desc && <Text>{desc}</Text>}
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.state;
    const { bookmarkStore, lastViewUrl } = this.props;
    return (
      <GridWrapper
        data={[{ url: lastViewUrl, desc: 'Last Open URL' }, ...images, ...bookmarkStore]}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        onEndReached={this.getNextImages}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1
    // borderWidth: 1,
    // borderColor: '#666',
  }
});
