const seq = require('sequelize');

const dotenv = require('dotenv');
dotenv.config();

const db = new seq({
	dialect: 'mysql',
	host: process.env.host, //loaclhost:3306
	database: process.env.database, //accuteDB
	username: process.env.acc_user,
	password: process.env.acc_pass
});

const Users = db.define('Users', {
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

const Products = db.define('Products', {
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
		allowNull: false,
		unique: true
	}
});

Products.belongsTo(Users);

const Accounts = db.define('Accounts', {
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
		type: seq.INTEGER
	}
});

Accounts.belongsTo(Users);

const Vouch = db.define('Vouch', {
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
	}
});

Vouch.belongsTo(Users);

const Vouch_pro = db.define('Vouch_pro', {
	id: {
		type: seq.INTEGER,
		autoIncrement: true,
		primaryKey: true
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
Vouch_pro.belongsTo(Vouch);

module.exports = { db, Users, Products, Accounts, Vouch, Vouch_pro };
