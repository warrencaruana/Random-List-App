import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, RefreshControl, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { render } from 'react-dom';

const itemsPerPage = 15;

export default function App() {

  const [people, setPeople] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showBottomSpinner, setShowBottomSpinner] = useState<boolean>(false);

  const RandomUserApi = async(numberOfItems:number) => {
    let response = await axios('https://randomuser.me/api/?results=' + numberOfItems);
    return response.data.results
  }

  const requestToServer = async(numberOfItems:number) => {
    let data = await RandomUserApi(numberOfItems);
    setPeople(items => items.concat(data));
    setIsRefreshing(false);
  }

  const refreshList = async(numberOfItems:number) => {
    let data = await RandomUserApi(numberOfItems);
    setPeople(data);
  }

  useEffect( () => {
    requestToServer(itemsPerPage);
  }, [])

  const handleLoadMore = () => {
    setIsRefreshing(true);
    requestToServer(itemsPerPage);
  }

  const renderFooter = () => {
    if (!showBottomSpinner) return null

    return (
      <ActivityIndicator/>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={people}
        keyExtractor={(item) => {
          return item.login.uuid
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            onRefresh={() => refreshList(itemsPerPage)}
            refreshing={isRefreshing}
          />
        }
        renderItem={({ item, index}:any) => (
          <TouchableWithoutFeedback onPress={() => alert(index)}>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <Image source={{uri: item.picture.large}} style={styles.imageView}></Image>
              <View>
                <Text style={styles.item}>{item.name.title} {item.name.first}</Text>
                <Text style={styles.location}>{item.location.country}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 50
  },
  item: {
    color: '#000'
  },
  location: {
    color: '#aaa'
  },
  imageView: {
    width: 100,
    height: 100,
    margin: 7,
    borderRadius : 7
  },
});
