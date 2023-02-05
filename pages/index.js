import React from "react";
import campaignFactory from "../etherium/factory";

function CampaignIndex({campaigns}) {
  console.log("Campaigns:",campaigns);
  return (
    <h1>Campaign Index {campaigns[0]}</h1>
  )
}

CampaignIndex.getInitialProps = async (ctx) => {
  const campaigns = await campaignFactory.methods.getDeployedCampaign().call();
  return { campaigns }
}


export default CampaignIndex
