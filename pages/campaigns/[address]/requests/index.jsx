import Layout from "@/components/Layout";
import RequestRow from "@/components/RequestRow";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Tab, Table } from "semantic-ui-react";
import Campaign from "@/etherium/campaign";

const RequestIndex = ({ requests, requestsCount, approversCount }) => {
  const router = useRouter();
  const { address } = router.query;
  const columns = [
    "ID",
    "Description",
    "Amount",
    "Recipient",
    "Approval Count",
    "Approve",
    "Finalize",
  ];

  const renderRow = () => {
    return requests.map((request, index) => {
      return <RequestRow key={index} index={index} request={request} address={address} approversCount={approversCount}/>
    })
  }

  return (
    <Layout>
      <h3>Request List</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button floated="right" primary style={{marginBottom: "10px"}}>Add Request</Button>
      </Link>
      <Table >
        <Table.Header>
          <Table.Row>
          {
            columns.map((item, index) => <Table.HeaderCell>{item}</Table.HeaderCell>)
          }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {renderRow()}
        </Table.Body>
      </Table>
      <h4>{requestsCount} requests found!</h4>
    </Layout>
  );
};

RequestIndex.getInitialProps = async ({ query }) => {
  const campaign = Campaign(query.address);
  const requestsCount = await campaign.methods.requestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((item, index) => {
        return campaign.methods.requests(index).call()
      })
  );

  return { requests, requestsCount, approversCount };
};

export default RequestIndex;
