import React, { useState } from 'react'
import { Form, Input, Grid, Dropdown } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ callableOf: '', addressTo: '', amount: 0 })

  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }))
  }

  const { callableOf, addressTo, amount } = formState

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
    <Grid.Column width={5}>
      <h1>Reward or Punish</h1>
      <Form>

        <Form.Field>
          <Dropdown
            placeholder="Reward or Punish"
            fluid
            selection
            search
            options={[{key:"reward", text:"Reward", value:"reward"},{key:"punish", text:"Punish", value:"punish"}]}
            state="callableOf"
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <Input
            label="Who"
            type="text"
            fluid
            selection
            search
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label="Amount"
            type="number"
            state="amount"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Submit"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'reward',
              callable: callableOf,
              inputParams: [addressTo, amount],
              paramFields: [true, true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
