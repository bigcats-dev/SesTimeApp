import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native-paper'

function Error({ message }) {
    return (
        <Text style={{
            color: 'red',
            fontSize: 16
        }}>{message}</Text>
    )
}

Error.propTypes = {
    message: PropTypes.string.isRequired
}

export default React.memo(Error)

