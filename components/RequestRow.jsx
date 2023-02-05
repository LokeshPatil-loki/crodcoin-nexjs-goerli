import { Button, Tab, Table } from "semantic-ui-react";
import web3 from "@/etherium/web3";
import Campaign from "@/etherium/campaign";

const RequestRow = ({ request, index, address, approversCount }) => {
  const readyToFinalize = request.approvalCount > (approversCount/2) && !request.complete;
  const onApprove = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      const campaign = Campaign(address);
      await campaign.methods.approveRequest(index).send({ from: accounts[0] });
      alert("Success");
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  const onFinalize = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      const campaign = Campaign(address);
      await campaign.methods.finalizeRequest(index).send({ from: accounts[0] });
      alert("Success");
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };
  return (
    <Table.Row disabled={request.complete} positive={readyToFinalize}>
      <Table.Cell>{index + 1}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value + "", "ether")}</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && <Button basic color="green" onClick={onApprove}>
          Approve
        </Button>}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && <Button basic color="teal" onClick={onFinalize}>Finalize</Button>}
      </Table.Cell>
    </Table.Row>
  );
};

export default RequestRow;
