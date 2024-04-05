module.exports = (mongoose) => {

	const initializeSchemas = require('./schemas');

	const { 
    TournamentSchema,
    CricapiMatchSchema,
		UserSchema,
		GroupSchema,
		GroupMemberSchema,
		PlayerSchema,
		AuctionSchema, 
	} = initializeSchemas(mongoose);

    //models
  const M_Tournament = mongoose.model('tournaments', TournamentSchema);
  const M_CricapiMatch = mongoose.model('cricApiMatch', CricapiMatchSchema);
	const M_User = mongoose.model('users', UserSchema);
	const M_Group = mongoose.model('iplgroups', GroupSchema);
	const M_GroupMember = mongoose.model('groupmembers', GroupMemberSchema);
	const M_Players = mongoose.model('iplplayers', PlayerSchema);
	const M_Auction = mongoose.model('iplauction', AuctionSchema);
	
	return {
    M_Tournament,
    M_CricapiMatch,
		M_User,
		M_Group,
		M_GroupMember,
		M_Players,
		M_Auction,
	}
}