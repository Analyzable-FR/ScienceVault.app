import React, { useState } from 'react'
import { Form, Input, Grid } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'


export default function Main(props) {
  const [status, setStatus] = useState(null);
  const [hashState, setHash] = useState('');
  const [formState, setFormState] = useState({ owner: '', timestamp: '', sources: '' })

  const onChange = (data) => {
      setFormState( {owner: data.unwrapOrDefault().owner.toHuman(), timestamp: data.unwrapOrDefault().timestamp.toHuman(), sources: data.unwrapOrDefault().sources.toHuman()} )
  }

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

  const onHash = (e, data) => {
    if (e.target.type==="file") {
      document.getElementById('manualHash').value="";
      const promises = [...e.target.files].map((f) => makePromise(f));
      Promise.all(promises).then((a) => {
        const { blake2AsHex } = require('@polkadot/util-crypto');
        const hash = blake2AsHex(a[0], 256, false)
        setHash(hash);
      });
    }
    else {
      document.getElementById('autoHash').value="";
      setHash(data.value);
    }
  };

  const { owner, timestamp, sources } = formState
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
      <h1>Search Vault</h1>
      <Form>

        <Form.Field>
          <Input
            fluid
            label="Element"
            type="file"
            onChange={onHash}
            id="autoHash"
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label=" Or Hash"
            type="text"
            id="manualHash"
            placeholder={hashState}
            onChange={onHash}
          />
        </Form.Field>

        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Search"
            type="QUERY"
            setStatus={setStatus}
            setStatusRaw={onChange}
            attrs={{
              palletRpc: 'vault',
              callable: 'vault',
              inputParams: [hashState],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Owner"
            type="text"
            value={owner}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Timestamp"
            type="text"
            value={timestamp}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Sources"
            type="text"
            value={sources}
            onChange={onChange}
          />
        </Form.Field>

        <div hidden style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
