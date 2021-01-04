<template>
  <div class="groupChat_drawer">
    <h3>群组信息</h3>
    <div class="box_title">
      <h3>群名称</h3>
      <p>{{ data[0].name }}</p>
      <span>{{ data[0].id }}</span>
      <br />
      <span v-text="data[0].public ? '公开群' : '私有群'"></span>
    </div>
    <div class="box_main">
      <h3>群成员:{{ data[0].affiliations_count }}</h3>
      <ul>
        <li v-for="(item, index) in data[0].affiliations" :key="index">
          <div v-if="item.owner">群主{{ item.owner }}</div>
          <div v-if="item.member">群成员{{ item.member }}</div>
        </li>
        <!-- <li>群主{{ item.owner }}</li> -->
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          id: "133607439007745",
          name: "售前支持二群",
          description: "售前支持群测试二群",
          membersonly: false,
          allowinvites: false,
          maxusers: 200,
          owner: "hfp",
          created: 1606816383539,
          custom: "",
          mute: false,
          affiliations_count: 6,
          affiliations: [
            {
              member: "hfp5",
              joined_time: 1608738730014
            },
            {
              member: "ios-fmy",
              joined_time: 1607078135857
            },
            {
              member: "wyfnszgr",
              joined_time: 1607077798977
            },
            {
              member: "pfh",
              joined_time: 1606816522529
            },
            {
              member: "13031081380",
              joined_time: 1606816406453
            },
            {
              owner: "hfp",
              joined_time: 1606816383565
            }
          ],
          public: true,
          shieldgroup: false
        }
      ]
    }
  }
}
</script>
