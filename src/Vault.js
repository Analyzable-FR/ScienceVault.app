import React, { useState } from 'react'
import { Form, Input, Grid } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'


export default function Main(props) {
  const [status, setStatus] = useState(null);
  const [source, setSource] = useState(null);
  const [hashState, setHash] = useState('');

 const makePromise = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        let arrayBuffer = new Uint8Array(reader.result);
        resolve(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onHash = (e) => {
    if (e.target) {
      const promises = [...e.target.files].map((f) => makePromise(f));
      Promise.all(promises).then((a) => {
        const { blake2AsHex } = require('@polkadot/util-crypto');
        const hash = blake2AsHex(a[0], 256, false)
        setHash(hash);
      });
    }
  };

  const onChange = (_, data) => {
    setSource(data.value)
  }

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
      <h1>Put in Vault</h1>
      <Form>

        <Form.Field>
          <Input
            fluid
            label="Element"
            type="file"
            onChange={onHash}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label="Hash"
            type="text"
            value={hashState}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label="Source"
            type="text"
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Put Element"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'vault',
              callable: 'addElement',
              inputParams: [hashState],
              paramFields: [true],
            }}
          />
          <TxButton
            label="Add source"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'vault',
              callable: 'setElementSource',
              inputParams: [hashState, source],
              paramFields: [true, true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
