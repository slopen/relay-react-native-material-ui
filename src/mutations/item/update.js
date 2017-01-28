import Relay from 'react-relay';

export default class UpdateItemMutation extends Relay.Mutation {

    getMutation () {
        return Relay.QL`
            mutation {
                updateItem
            }
        `;
    }

    getFatQuery () {
        return Relay.QL`
            fragment on updateItemPayload {
                item {
                    id,
                    name,
                    content
                }
            }
        `;
    }

    getConfigs () {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                item: this.props.item.id
            }
        }];
    }

    getVariables () {
        const {item: {id}, name, content} = this.props;

        return {
            id,
            name,
            content
        };
    }

    getOptimisticResponse () {
        const {item: {id}, name, content} = this.props;

        return {
            item: {
                id,
                name,
                content
            }
        };
    }
}
