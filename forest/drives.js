const { collection } = require('forest-express-sequelize');
const { drives, drivers } = require('../models');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('drives', {
  actions: [{
    name: "Add fake drives",
    type: 'global',
  },
  {
    name: "Cancel drive",
    type: 'single'
  },
  {
    name: 'Change driver',
    type: 'single',
    fields: [{
      field: 'Driver',
      description: 'Choose from available drivers',
      type: 'Enum',
    }],
    hooks: {
      load: async({ fields, request }) => {
        const driver = fields.find(field=> field.field === 'Driver');
        
        const id = request.body.data.attributes.ids[0];
        const drive = await drives.findByPk(id);
        const driverDefault = await drivers.findByPk(drive.driverIdKey)
        driver.value = `${driverDefault.firstName} ${driverDefault.lastName} -${driverDefault.id}`

        driver.enums = await drivers.findAll({raw: true}, {where: { bookingStatus: "available" }}).map(driver => `${driver.firstName} ${driver.lastName} -${driver.id}`);
        return fields;


      }
    }
  }
],
  fields: [],
  segments: [],
  
});