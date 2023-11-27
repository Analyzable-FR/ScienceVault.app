import React, { useState } from 'react'
import { Form, Input, Grid } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [statusRaw, setStatusRaw] = useState(null)
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ who: '' })

  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }))
  }

  const onQuery = (data) => {
      setStatusRaw(data.unwrapOrDefault().reputation.toHuman())
  }

  const { who } = formState

  const { keyring } = useSubstrateState()
  const accounts = keyring.getPairs()

  const availableAccounts = []
  accounts.map(account => {
    return availableAccounts.push({
      key: account.meta.name,
      text: account.meta.name,
      value: account.address,
    })
  })

  return (
    <Grid.Column width={8}>
      <h1>Check Reputation</h1>
      <Form>

        <Form.Field>
          <Input
            fluid
            label="Who"
            type="text"
            state="who"
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Submit"
            type="QUERY"
            setStatus={setStatus}
            setStatusRaw={onQuery}
            attrs={{
              palletRpc: 'reward',
              callable: "reputations",
              inputParams: [who],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Reputation"
            type="text"
            value={statusRaw}
          />
        </Form.Field>
        <div hidden style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
