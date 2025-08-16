import React from 'react'
import { Button } from '../ui/button'

type Props = {
    onReset: () => void;
}

const UIResetBtn = ({ onReset }: Props) => {
    return (
        <Button
            variant="gray"
            onClick={onReset}
        >
            リセット
        </Button>
    )
}

export default UIResetBtn