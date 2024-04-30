// use FormData to process user entries and hanlde the images attached
    // const formData = new FormData();
    // formData.append('ninNumber', document.getElementById('nin').value);
    // formData.append('lastname', document.getElementById('lastname').value);
    // formData.append('firstname', document.getElementById('firstname').value);
    // formData.append('username', document.getElementById('username').value);
    // formData.append('dateOfBirth', document.getElementById('dob').value);
    // formData.append('state', document.getElementById('state').value);
    // formData.append('lga', document.getElementById('lga').value);
    // formData.append('email', document.getElementById('userEmail').value);
    // formData.append('phonenumber', document.getElementById('phonenumber').value);
    // formData.append('gender', document.getElementById('gender').value);
    // formData.append('password', document.getElementById('userPassword').value);
    // // Append files to formData
    // formData.append('uploadID', document.getElementById('uploadID').files[0]);
    // formData.append('uploadSelfie', document.getElementById('uploadSelfie').files[0]);


// const electionData = {
//     "GeneralElections": ["President", "Senate", "MHA"],
//     "StatesElections": ["Governor", "HOR"],
//     "LgaElections": ["Chairman", "Deputy"]
// };

// const electionTypeAndParties =  {
//     "President": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Senate": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "MHA": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Governor": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "HOR": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Chairman": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Deputy": ["ADC", "APC", "LP", "NNPP", "PDP"]
// }

// const partyData = {
//     "President": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Senate": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "MHA": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Governor": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "HOR": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Chairman": ["ADC", "APC", "LP", "NNPP", "PDP"],
//     "Deputy": ["ADC", "APC", "LP", "NNPP", "PDP"]
// };


// Array dummy data to simulate fetched data from database
// const voters = [
//     { Surname: 'Smith', GivenNames: 'John Alex', Age: 35, VerificationProgress: '1/5', ProfileStatus: 'Rejected' },
//     { Surname: 'Johnson', GivenNames: 'Lara Beth', Age: 42, VerificationProgress: '5/5', ProfileStatus: 'Approved' },
//     { Surname: 'John', GivenNames: 'Doe', Age: 22, VerificationProgress: '4/5', ProfileStatus: 'Under Review' },
// ];



// Array dummy data to simulate fetched data from database
// const votes = [
//     { VoteId: 1, NamesInitials: 'S. J. A', Age: 35, TimeVoted: '2023-05-12', Status: 'Rejected' },
//     { VoteId: 2, NamesInitials: 'J. L. B', Age: 42, TimeVoted: '2023-05-12', Status: 'Approved' },
//     { VoteId: 3, NamesInitials: 'J. D', Age: 22, TimeVoted: '2023-05-12', Status: 'Under Review' },
// ];

// Dummy data for election to build election result page before setting the database
// const electionsList = ['General Election - President 2024', 'General Election - Senate 2024', 'States Election - Governor 2024'];
// // const electionsList = [];
// const electionsData = {
//     'General Election - President 2024': [
//         { partyName: 'PDP', partyLogo: 'pdp.jpg', candidateName: 'John Doe', candidateLogo: 'john.jpg', totalVotes: 2000 },
//         { partyName: 'APC', partyLogo: 'apc.jpg', candidateName: 'Jane Doe', candidateLogo: 'jane.jpg', totalVotes: 1500 },
//         { partyName: 'LP', partyLogo: 'lp.jpg', candidateName: 'Jim Beam', candidateLogo: 'jim.jpg', totalVotes: 2500 }
//     ],
// };


// Frontend constructs full URL and redirects
// window.location.href = `${window.location.origin}${data.path}`;

    // const ninNumber = nin.value;
    // const lastname = document.getElementById('lastname').value;
    // const firstname = document.getElementById('firstname').value;
    // const username = document.getElementById('username').value;
    // const dateOfBirth = document.getElementById('dob').value;
    // const state = document.getElementById('state').value;
    // const lga = document.getElementById('lga').value;
    // const email = document.getElementById('userEmail').value;
    // const phonenumber = document.getElementById('phonenumber').value;
    // const gender = document.getElementById('gender').value;
    // const password = document.getElementById('userPassword').value;
    // const uploadID = document.getElementById('uploadID').files[0];
    // const uploadSelfie = document.getElementById('uploadSelfie').files[0];

    // console.log(ninNumber)
    // console.log(lastname);
    // console.log(firstname);
    // console.log(username);
    // console.log(dateOfBirth);
    // console.log(state);
    // console.log(lga);
    // console.log(email);
    // console.log(phonenumber);
    // console.log(gender);
    // console.log(password);
    // console.log(uploadID);
    // console.log(uploadSelfie);



// // confirmVoterAgeEligibilty
// const confirmVoterAgeEligibilty = async () => {
//     try {
//         await users.updateMany({}, [{ $set: { isDOBeligibleToVote: { $gte: ["$age", 18 ]} }}])
//         console.log('Users age eligibility has been confirmed')
//     } catch (error) {
//         console.log(`Error updating user eligibility: ${error.message}`)
//     }
// }
// // confirmVoterAgeEligibilty()

    // window.location.href = `${window.location.origin}${data.path}`;


//     <!-- <div>
//     <p>Profile photo</p>
//     <img src="../images/placeholder-image.jpeg" alt="selfie-image" width="300px" height="160px">
// </div>
// <div>
//     <p>ID CARD</p>
//     <img src="../images/nigeria-flag.png" alt="selfie-image" width="300px" height="200px">
//     <span class="verified">&#8987</span>
// </div>
// <div class="user-details">
//     <p>NIN: <input type="text" name="" id="" value="23423423422" disabled> <span
//             class="verified">&#10004</span></p>
//     <div>
//         <p>Surname: <input type="text" name="" id="" value="John" disabled></p>
//         <p>Firstname: <input type="text" name="" id="" value="Doe" disabled></p>
//     </div>
//     <div>
//         <p>Other names: <input type="text" name="" id="" value="Mark" disabled></p>
//         <p>Gender: <input type="text" name="" id="" value="Male" disabled></p>
//     </div>
//     <div>
//         <p>Date of Birth: <input type="date" name="" id="" value="" disabled></p>
//         <p>Age: <input type="number" name="" id="" value="64" disabled></p>
//     </div>
//     <div>
//         <p>State: <input type="text" name="" id="" value="Lagos" disabled></p>
//         <p>LGA: <input type="text" name="" id="" value="Lekki" disabled></p>
//     </div>
//     <div style="display: flex;">
//         <p>Email: <input type="email" name="" id="" value="John@gmail.com" disabled> <span
//                 class="verified">&#10008</span></p>
//         <button class="mybutton" onclick="verifyEmail()">Verify Email</button>
//     </div>
//     <div style="display: flex;">
//         <p>Phone: <input type="text" name="" id="" value="+234704864789" disabled> <span
//                 class="verified">&#8987</span></p>
//         <button class="mybutton" onclick="verifyPhoneNumber()">Verify Phone No</button>
//     </div>
// </div>
// <button class="mybutton">Edit Profile</button> -->
// <!-- <tr>
//                                 <th>Title</th>
//                                 <th>Value</th>
//                                 <th>Action</th>
//                             </tr>
//                             <tr>
//                                 <td>VOTING ID</td>
//                                 <td id="voting-id">232123213</td>
//                                 <td>
//                                     <button id="copy-voting-id" onclick="clickToCopyVotingId('voting-id')">Copy Voting Id</button>
//                                 </td>
//                             </tr> -->


// <!-- <div class="election-tab" id="nevs-confirm-vote">
//                             <p>Confirm your vote for PRESIDENT?</p>
//                             <button id="changePRESIDENTVote" onclick="changeVote()">Change Vote</button>
//                             <button id="confirmPRESIDENTVote" onclick="votingCompleted()">Yes</button>
//                         </div> -->
//                         <!-- Senate election -->
//                         <!-- <div class="election-tab" id="nevs-SENATE">
//                             <h2>SENATE Election</h2>
//                             <form id="SENATE">
//                                 <table>
//                                     <tr>
//                                         <th>Party</th>
//                                         <th>Party Logo</th>
//                                         <th>Candidate Name</th>
//                                         <th>Image</th>
//                                         <th>Action</th>
//                                     </tr>
//                                     <tr>
//                                         <td>P1</td>
//                                         <td>P1 Logo</td>
//                                         <td>Charles</td>
//                                         <td>Charles Image</td>
//                                         <td><input type="radio" name="SENATEVote" value="Roland"></td>
//                                     </tr>
//                                     <tr>
//                                         <td>P2</td>
//                                         <td>P2 Logo</td>
//                                         <td>Mary</td>
//                                         <td>Mary Image</td>
//                                         <td><input type="radio" name="SENATEVote" value="Orobola"></td>
//                                     </tr>
//                                     <tr>
//                                         <td>P3</td>
//                                         <td>P3 Logo</td>
//                                         <td>AY</td>
//                                         <td>AY Image</td>
//                                         <td><input type="radio" name="SENATEVote" value="Oguns"></td>
//                                     </tr>
//                                 </table>
//                                 <button type="button" id="voteSENATE" onclick="voteCandidateSen()">Vote</button>
//                             </form>
//                         </div> -->
//                         <!-- <div class="election-tab" id="nevs-confirm-vote-sen">
//                             <p>Confirm your vote for SENATE?</p>
//                             <button id="changeSENATEVote" onclick="changeVoteSen()">Change Vote</button>
//                             <button id="confirmSENATEVote" onclick="votingCompleted()">Yes</button>
//                         </div> -->


// <!-- <h2>PRESIDENTIAL Election</h2> -->
// <!-- <form id="PRESIDENT">
//     <table>
//         <tr>
//             <th>Party</th>
//             <th>Party Logo</th>
//             <th>Candidate Name</th>
//             <th>Image</th>
//             <th>Action</th>
//         </tr>
//         <tr>
//             <td>P1</td>
//             <td>P1 Logo</td>
//             <td>Roland</td>
//             <td>Roland Image</td>
//             <td><input type="radio" name="PRESIDENTVote" value="Roland"></td>
//         </tr>
//         <tr>
//             <td>P2</td>
//             <td>P2 Logo</td>
//             <td>Orobola</td>
//             <td>Orobola Image</td>
//             <td><input type="radio" name="PRESIDENTVote" value="Orobola"></td>
//         </tr>
//         <tr>
//             <td>P3</td>
//             <td>P3 Logo</td>
//             <td>Oguns</td>
//             <td>Oguns Image</td>
//             <td><input type="radio" name="PRESIDENTVote" value="Oguns"></td>
//         </tr>
//     </table>
//     <button type="button" id="votePRESIDENT" onclick="voteCandidate()">Vote</button>
// </form> -->