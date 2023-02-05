import { use, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "@/etherium/campaign";
import web3 from "@/etherium/web3";
import Layout from "@/components/Layout";
import Link from "next/link";

const { useRouter } = require("next/router");

const RequestNew = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [amount, setamount] = useState("");
  const [recipient, setrecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { address } = router.query;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("")
    try {
      const accounts = await web3.eth.requestAccounts();
      const campaign = Campaign(address);

      const value = web3.utils.toWei(amount, "ether");
      setLoading(true);
      await campaign.methods
        .createRequest(description, value, recipient)
        .send({ from: accounts[0] });
      setLoading(false);
      router.push(`/campaigns/${address}/requests`)
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message)
    }
  };
  return (
    <Layout>
      <Link href={`/campaigns/${address}/requests`}>
        Back
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            value={amount}
            onChange={(e) => setamount(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={(e) => setrecipient(e.target.value)} />
        </Form.Field>
        <Button loading={loading} primary>Create</Button>
        {errorMessage && <Message negative header="Oops!" content={errorMessage}/>}
      </Form>
    </Layout>
  );
};

export default RequestNew;
