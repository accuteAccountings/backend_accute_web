const seq = require("sequelize");

const dotenv = require("dotenv");
dotenv.config();

const db = new seq({
  dialect: "mysql",
  host: process.env.host, //loaclhost:3306
  database: process.env.database, //accuteDB
  username: process.env.acc_user,
  password: process.env.acc_pass
});

const Users = db.define("Users", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  username: {
    type: seq.STRING(40)
  },
  password: {
    type: seq.STRING(40)
  },

  token: {
    type: seq.STRING(15),
    allowNull: false
  },
  full_name: {
    type: seq.STRING(70)
  },
  email: {
    type: seq.STRING(50)
  },
  phone_num: {
    type: seq.INTEGER
  },
  occupation: {
    type: seq.TEXT
  },
  pro_img: {
    type: seq.TEXT
  }
});

const Products = db.define("Products", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  product_name: {
    type: seq.STRING(100),
    allowNull: false
  },
  hsn_num: {
    type: seq.STRING(50),
    allowNull: false
  }
});

Products.belongsTo(Users);

const Accounts = db.define("Accounts", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  acc_name: {
    type: seq.STRING(100),
    allowNull: false
  },
  print_name: {
    type: seq.STRING(100)
  },
  acc_type: {
    type: seq.STRING(20)
  },
  status: {
    type: seq.STRING(50)
  },
  gst_num: {
    type: seq.STRING(50)
  },
  pan_num: {
    type: seq.STRING(50)
  },
  aadhar_num: {
    type: seq.STRING(50)
  },
  address_line1: {
    type: seq.STRING(100)
  },
  address_line2: {
    type: seq.STRING(100)
  },
  state: {
    type: seq.STRING(50)
  },
  city: {
    type: seq.STRING(50)
  },
  pincode: {
    type: seq.STRING(50)
  },
  mob_num: {
    type: seq.STRING(50)
  },
  phone_num: {
    type: seq.STRING(50)
  },
  emailId: {
    type: seq.STRING(50)
  },
  notes: {
    type: seq.TEXT
  },
  bal: {
    type: seq.STRING(50)
  },
  Balance: {
    type: seq.STRING(50),
    defaultValue: "0"
  }
});

Accounts.belongsTo(Users);

const Vouch = db.define("Vouch", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  deleted: {
    type: seq.BOOLEAN,
    defaultValue: false
  },

  bill_date: {
    type: seq.STRING(100),
    allowNull: false
  },
  type: {
    type: seq.STRING(100)
  },
  bill_num: {
    type: seq.STRING(20)
  },
  g_r_num: {
    type: seq.STRING(50)
  },
  transport_name: {
    type: seq.STRING(50)
  },
  status: {
    type: seq.STRING(20),
    defaultValue: "UNPAID"
  },
  supplier: {
    type: seq.STRING(50)
  },
  supplier_agent: {
    type: seq.STRING(50)
  },
  supplier_agent2: {
    type: seq.STRING(50)
  },
  gst: {
    type: seq.STRING(50)
  },
  set_commission: {
    type: seq.STRING(100)
  },
  customer: {
    type: seq.STRING(100)
  },
  totalAmt: {
    type: seq.STRING(50)
  },
  Bal_left_supplier: {
    type: seq.STRING(50)
  },
  Bal_left_costumer: {
    type: seq.STRING(50)
  },
  discountArr: {
    type: seq.TEXT,

    get() {
      return this.getDataValue("discountArr").split(";");
    },
    set(val) {
      this.setDataValue("discountArr", val.join(";"));
    },

    defaultValue: []
  },
  freightArr: {
    type: seq.TEXT,

    get() {
      return this.getDataValue("freightArr").split(";");
    },
    set(val) {
      this.setDataValue("freightArr", val.join(";"));
    },

    defaultValue: []
  },
  IsDeleted: {
    type: seq.BOOLEAN,
    defaultValue: false
  }
});

Vouch.belongsTo(Users);

const Vouch_pro = db.define("Vouch_pro", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hsn_num: {
    type: seq.STRING(50)
  },
  product_name: {
    type: seq.STRING(100),
    allowNull: false
  },
  quantity: {
    type: seq.STRING(100)
  },
  rate: {
    type: seq.STRING(20)
  },
  dicon: {
    type: seq.STRING(50)
  },
  amount: {
    type: seq.INTEGER
  },
  g_amount: {
    type: seq.INTEGER
  }
});
Vouch_pro.belongsTo(Vouch);

const Debit = db.define("Debit", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  bill_date: {
    type: seq.STRING(100),
    allowNull: false
  },
  type: {
    type: seq.STRING(100)
  },
  bill_num: {
    type: seq.STRING(20)
  },
  g_r_num: {
    type: seq.STRING(50)
  },
  transport_name: {
    type: seq.STRING(50)
  },
  supplier: {
    type: seq.STRING(50)
  },
  supplier_agent: {
    type: seq.STRING(50)
  },
  set_commission: {
    type: seq.STRING(100)
  },
  customer: {
    type: seq.STRING(100)
  },
  ref_num: {
    type: seq.STRING(50)
  }
});

Debit.belongsTo(Users);

const Debit_pro = db.define("Debit_pro", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hsn_num: {
    type: seq.STRING(50)
  },
  product_name: {
    type: seq.STRING(100),
    allowNull: false
  },
  quantity: {
    type: seq.STRING(100)
  },
  rate: {
    type: seq.STRING(20)
  },
  gst: {
    type: seq.STRING(50)
  },
  totalAmt: {
    type: seq.STRING(50)
  }
});
Debit_pro.belongsTo(Debit);

const Credit = db.define("Credit", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  bill_date: {
    type: seq.STRING(100),
    allowNull: false
  },
  type: {
    type: seq.STRING(100)
  },
  bill_num: {
    type: seq.STRING(20)
  },
  g_r_num: {
    type: seq.STRING(50)
  },
  transport_name: {
    type: seq.STRING(50)
  },
  supplier: {
    type: seq.STRING(50)
  },
  supplier_agent: {
    type: seq.STRING(50)
  },
  set_commission: {
    type: seq.STRING(100)
  },
  customer: {
    type: seq.STRING(100)
  },
  ref_num: {
    type: seq.STRING(50)
  },
  totalAmt: {
    type: seq.STRING(50)
  }
});

Credit.belongsTo(Users);

const Credit_pro = db.define("Credit_pro", {
  id: {
    type: seq.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hsn_num: {
    type: seq.STRING(50)
  },
  product_name: {
    type: seq.STRING(100),
    allowNull: false
  },
  quantity: {
    type: seq.STRING(100)
  },
  rate: {
    type: seq.STRING(20)
  },
  gst: {
    type: seq.STRING(50)
  }
});
Credit_pro.belongsTo(Credit);

const JoVouch = db.define("JoVouch", {
  id: { type: seq.INTEGER, autoIncrement: true, primaryKey: true },
  bill_date: {
    type: seq.STRING(20)
  },
  IsDeleted: { type: seq.BOOLEAN },
  type: {
    type: seq.STRING(20)
  },
  credit_acc: {
    type: seq.STRING(100)
  },

  debit_acc: {
    type: seq.STRING(100)
  },
  payArr: {
    type: seq.TEXT,

    get() {
      return this.getDataValue("payArr").split(";");
    },
    set(val) {
      this.setDataValue("payArr", val.join(";"));
    },

    defaultValue: []
  },
  billArr: {
    type: seq.TEXT,

    get() {
      return this.getDataValue("billArr").split(";");
    },
    set(val) {
      this.setDataValue("billArr", val.join(";"));
    },

    defaultValue: []
  },
  amount: {
    type: seq.STRING(30)
  },
  balance: {
    type: seq.STRING(30)
  },
  Bal_left_credit: {
    type: seq.STRING(50)
  },
  Bal_left_debit: {
    type: seq.STRING(50)
  }
});

const CoverLetters = db.define('CLetters' , {
  id: {
     type: seq.INTEGER, 
     autoIncrement: true, 
     primaryKey: true
     },
  cover_Letter : {
    type : seq.TEXT,
    allowNull : false
  }
})

const CoverNotes = db.define('CNotes' , {
  id: {
     type: seq.INTEGER, 
     autoIncrement: true, 
     primaryKey: true
     },
  cover_note : {
    type : seq.TEXT,
    allowNull : false
  },
  date : {
    type : seq.TEXT,
    defaultValue : ''
  }
})

CoverNotes.belongsTo(CoverLetters)

CoverLetters.belongsTo(Users)

JoVouch.belongsTo(Users);

const Invoice = db.define('Invoice' , {
  id: {
    type: seq.INTEGER, 
    autoIncrement: true, 
    primaryKey: true
    },
  supplier : {
    type : seq.STRING, 
  },
  gst : {
    type : seq.INTEGER
  },
  date : {
    type : seq.STRING
  }
})


const Invoice_Services = db.define('Inv_Services' , {
  id: {
    type: seq.INTEGER, 
    autoIncrement: true, 
    primaryKey: true
    },
    services_details : {
      type : seq.TEXT
    },
    sales_amount :{
      type : seq.STRING
    },
    commission : {
      type : seq.INTEGER
    }
})

Invoice_Services.belongsTo(Invoice)
Invoice.belongsTo(Users)

module.exports = { db, JoVouch, Users, Products, Accounts, Vouch, Debit, Credit,
   Credit_pro, Vouch_pro, Debit_pro , CoverLetters , CoverNotes , Invoice , Invoice_Services };
