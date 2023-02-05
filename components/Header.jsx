import { Menu, Icon } from "semantic-ui-react"

export default () => {
  return <Menu style={{ margin: "10px auto 20px"}}>
    <Menu.Item header name="CrowdCoin" />
    <Menu.Menu position="right">
      <Menu.Item name="Campaigns"/>
      <Menu.Item>
        <Icon name="plus"/>
      </Menu.Item>
    </Menu.Menu>
  </Menu>
}