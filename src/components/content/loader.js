import {
    ActivityIndicator,
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create ({
    loader: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default ({display}) =>
    display ? (
        <View style={styles.loader}>
            <ActivityIndicator/>
        </View>
    ) : null