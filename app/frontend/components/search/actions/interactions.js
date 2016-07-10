import * as actionTypes from './../constants/ActionsTypes'; 

const actionKeyEnter = (term) => ({
    type: actionTypes.LIST_KEY_ENTER,
    term
});

const actionKeyOther = (term) => ({
    type: actionTypes.LIST_KEY_OTHER,
    term
});

function interactions(key, data = array) {
    switch (key) {
        case 13:
            return actionKeyEnter(data[0]);
        default:
            return actionKeyOther(data[0])
    }
}

export default interactions;
