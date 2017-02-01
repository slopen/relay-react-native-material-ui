import React from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

import {ListItem} from 'react-native-material-ui';


const styles = {};

styles.close = StyleSheet.create ({
    container: {
        justifyContent: 'center',
        marginRight: -20,
        padding: 25,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: '#F7F7F7'
    },
    text: {
        color: 'red',
        fontSize: 20
    }
});

styles.listItem = StyleSheet.create ({
    container: {
        height: 70
    },
    primaryText: {
        fontSize: 20
    }
});


const RemoveButton = ({onRemove}) =>
    <TouchableOpacity
        style={styles.close.container}
        onPress={onRemove}>
        <Text style={styles.close.text}>&times;</Text>
    </TouchableOpacity>


export default (({text, onRemove}) => {
    return (
        <ListItem
            centerElement={{
                primaryText: text
            }}
            rightElement={
                onRemove ? <RemoveButton onRemove={onRemove}/> : null
            }
            style={styles.listItem}/>
    );
});