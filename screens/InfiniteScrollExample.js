import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native'

const getAvailableRoutes = navigation => {
    let availableRoutes = []
    if (!navigation) return availableRoutes
    const parent = navigation.dangerouslyGetParent()
    if (parent) {
	if (parent.router && parent.router.childRouters) {
	    // Grab all the routes the parent defines and add it the list
	    availableRoutes = [...availableRoutes, ...Object.keys(parent.router.childRouters)]
	}
	// Recursively work up the tree until there are none left
	availableRoutes = [...availableRoutes, ...getAvailableRoutes(parent)]
    }
    // De-dupe the list and then remove the current route from the list
    return [...new Set(availableRoutes)].filter(
	route => route !== navigation.state.routeName
    ) 
}

const useInfiniteScroll = load => {
    const [isFetching, setIsFetching] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
	let didCancel = false
	if (!isFetching) return

	const loadAsync = async () => {
	    const lastIndex = data.length
	    const lastItem = data.length ? data[lastIndex] : null
	    
	    const newData = await load({ lastIndex, lastItem })
	    if (!didCancel) {
		setData(prevState => [...prevState, ...newData])
		setIsFetching(false)
	    }
	}
	
	loadAsync()

	return () => {
	    didCancel = true
	}
    }, [isFetching])

    return [data, isFetching, setIsFetching]
}

const INITIAL_LOAD = 30
const PAGE_SIZE = 20

const InfiniteScrollExample = ({ navigation }) => {
    /**
     * Right now, I'm mandating that whatever this method is accepts as a
     * parameter an object containing the objects `lastIndex` and `lastObject`
     * respectively. I believe this should suffice for effective paging.
     *
     * @param lastIndex
     * @returns {Promise<R>}
     */
    const fetchMoreListItems = ({ lastIndex }) => {
	// Simulate fetch of next 20 items (30 if initial load)
	return new Promise(resolve => {
	    setTimeout(() => {
		resolve([
		    ...Array.from(
			Array(lastIndex === 0 ? INITIAL_LOAD : PAGE_SIZE).keys(),
			n => {
			    n = n + lastIndex
			    return {
				number: n.toString(),
				id: n.toString()
			    }
			}
		    )
		])
	    }, 2000)
	})
    }

    const [data, isFetching, setIsFetching] = useInfiniteScroll(
	fetchMoreListItems
    )

    return (
      <SafeAreaView style={styles.container}>
	<View style = {{flexDirection: 'row'}}>
          {getAvailableRoutes(navigation).map(route => (
          <TouchableOpacity
            onPress = {() => navigation.navigate(route)}
            key     = {route}
            style   = {{
              backgroundColor: "#fff",
              padding: 10,
              margin: 10,
              borderRadius: 10,
            }}
            >
            <Text style = {{alignSelf: "center"}}>{route}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.blueBox}>
        <Text style={styles.bigWhiteBoldText}>
          {`${data.length} Items Loaded`}
        </Text>
      </View>
      <FlatList
        onEndReachedThreshold={7}
        onEndReached={() => {
          if (!isFetching) {
            setIsFetching(true)
          }
        }}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return <Item item={item} />
        }}
      />
      {isFetching && (
        <View style={styles.blueBox}>
          <Text style={styles.bigWhiteBoldText}>(Fetching More)</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

class Item extends React.PureComponent {
    render() {
	return (
          <View style={styles.item}>
            <Text style={styles.title}>{this.props.item.number}</Text>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
	flex: 1,
	marginTop: 24,
	backgroundColor: 'yellow'
    },
    item: {
	backgroundColor: '#f9c2ff',
	alignItems: 'center',
	justifyContent: 'center',
	height: Dimensions.get('window').height * 0.10,
	marginVertical: 8,
	marginHorizontal: 16
    },
    title: {
	fontSize: 48
    },
    blueBox: {
	height: 50,
	backgroundColor: 'blue',
	justifyContent: 'center',
	alignItems: 'center'
    },
    bigWhiteBoldText: {
	color: 'white',
	fontSize: 32,
	fontWeight: 'bold'
    }
})

export default InfiniteScrollExample;
