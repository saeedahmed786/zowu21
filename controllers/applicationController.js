const Application = require('../Models/applicationModel');

exports.getAllApplications = async (req, res) => {
  const applications = await Application.find({ listingId: req.params.id }).populate('userId listingId').exec();
  console.log(applications)
  if (applications) {
    res.status(200).send(applications);
  } else {
    res.status(404).json({ errorMessage: 'No applications found!' });
  }
}


exports.getAllApplicationsByUserId = async (req, res) => {
  const applications = await Application.find({ userId: req.params.id }).populate('userId listingId').exec();
  console.log(applications)
  if (applications) {
    res.status(200).send(applications);
  } else {
    res.status(404).json({ errorMessage: 'No applications found!' });
  }
}

exports.getApplicationById = async (req, res) => {
  const findApplication = await Application.findOne({ _id: req.params.id }).populate('userId listingId').exec();
  if (findApplication) {
    res.status(200).send(findApplication);
  } else {
    res.status(404).json({ errorMessage: 'No applications found!' });
  }
}

exports.applyToListing = async (req, res) => {
  const application = new Application({
    description: req.body.description,
    price: req.body.price,
    userId: req.user._id,
    listingId: req.params.id
  });

  await application.save(((error, result) => {
    if (error) {
      res.status(400).json({ errorMessage: 'Failed to create Application. Please try again', error })
    }
    if (result) {
      res.status(200).send({ successMessage: 'Applied successfully', result });
    }

  }))
}



exports.updateApplication = async (req, res) => {
  const findApplication = await Application.findById({ _id: req.params.id });
  if (findApplication) {
    findApplication.description = req.body.description;
    findApplication.price = req.body.price;
    findApplication.listingId = req.body.listingId;
    findApplication.userId = req.user._id;
    await findApplication.save(((error, result) => {
      if (error) {
        res.status(400).json({ errorMessage: 'Failed to update Application. Please try again', error })
      }
      if (result) {
        res.status(200).send({ successMessage: 'Application updated successfully', result });
      }

    }))
  }
  else {
    res.status(404).json({ errorMessage: 'Application not found' });
  }

}


exports.acceptApplication = async (req, res) => {
  const findApplication = await Application.findById({ _id: req.params.id });
  if (findApplication) {
    findApplication.status = req.body.status;
    await findApplication.save(((error, result) => {
      if (error) {
        res.status(400).json({ errorMessage: 'Failed to set status of Application. Please try again', error })
      }
      if (result) {
        res.status(200).send({ successMessage: 'Application status updated successfully', result });
      }

    }))
  }
  else {
    res.status(404).json({ errorMessage: 'Application not found' });
  }
}


exports.deleteApplication = async (req, res) => {
  let application = await Application.findById({ _id: req.params.id });
  if (application) {
    Application.remove();
    res.status(200).json({ successMessage: 'Application deleted successfully' });
  }
}