class DataBase {
    constructor() {
        this.base = new Object();
    }
}

class Data_Group {
    constructor(group,owner) {
        this.group = group;
        this.owner = owner;
        this.users = [];
        this.documents = [];
    }

    AddUser(user)
    {
        this.users.push(user);
    }
    AddDocument(document)
    {
        this.documents.push(document)
    }
}

class Data_User {
    constructor(user, role = 10, group = "public") {
        this.user = user;
        this.role = role;
        this.group = group;
    }
}

class Data_Inventory {
    constructor(group = "public") {
        this.data = [];
        this.group = group;
    }
}

function SendInvTable()
{
    
}