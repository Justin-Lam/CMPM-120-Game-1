let beenToKresge = false;
let hasKeycard = false;

class Start extends Scene {
	create() {
		this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
		this.engine.addChoice("Introduction");
	}

	handleChoice() {
		this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
	}
}

class Location extends Scene {
	create(key) {
		let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
		this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
		
		if(locationData.Choices != undefined && locationData.Choices.length > 0) { // TODO: check if the location has any Choices
			for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
				this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
				// TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
			}
		} else {
			this.engine.addChoice("The end.")
		}
	}

	handleChoice(choice) {
		if(choice) {
			this.engine.show("&gt; "+choice.Text);
			if (choice.IsSpecial != undefined)
			{
				this.engine.gotoScene(SpecialLocation, choice.Target);
			}
			else
			{
				this.engine.gotoScene(Location, choice.Target);
			}
		} else {
			this.engine.gotoScene(End);
		}
	}
}

class SpecialLocation extends Location
{
	create(key) {
		// get locationData
		let locationData = this.engine.storyData.Locations[key];

		// Science Hill special behavior
		if (key == "ScienceHill")
		{
			// show body
			if (!beenToKresge)
			{
				this.engine.show(locationData.Bodies[0]);
			}
			else
			{
				if (!hasKeycard)
				{
					this.engine.show(locationData.Bodies[1]);
				}
				else
				{
					this.engine.show(locationData.Bodies[2]);
				}
			}
		}

		// Kresge special behavior
		if (key == "Kresge")
		{
			// show body
			if (!beenToKresge)
			{
				this.engine.show(locationData.Bodies[0]);
				beenToKresge = true;
			}
			else
			{
				this.engine.show(locationData.Bodies[1]);
			}
		}

		// show choices
		if(locationData.Choices != undefined && locationData.Choices.length > 0)
		{
			for(let choice of locationData.Choices)
			{
				if (choice.Hidden != undefined)
				{
					continue;
				}

				if (choice.Text == "Pickup keycard")
				{
					if (beenToKresge && !hasKeycard)
					{
						this.engine.addChoice(choice.Text, choice);
					}

					continue;
				}

				// Default behavior
				this.engine.addChoice(choice.Text, choice);
			}
		}
		else
		{
			this.engine.addChoice("The end.")
		}
	}

	handleChoice(choice)
	{
		if(choice)
		{
			if (choice.Text == "Pickup keycard")
			{
				hasKeycard = true;
				this.engine.show("&gt; " + choice.Response);

				let choices = this.engine.storyData.Locations.ScienceHill.Choices;
				this.engine.addChoice(choices[0].Text, choices[0]);
				this.engine.addChoice(choices[1].Text, choices[1]);

				return;
			}

			if (choice.Text == "Scan keycard")
			{
				if (hasKeycard)
				{
					this.engine.show("&gt; " + choice.SuccessResponse);

					let choices = this.engine.storyData.Locations.Kresge.Choices;
					for(let choice of choices)
					{
						this.engine.addChoice(choice.Text, choice);
					}

					return;
				}
				else
				{
					this.engine.show("&gt; " + choice.FailureResponse);

					let choices = this.engine.storyData.Locations.Kresge.Choices;
					for(let choice of choices)
					{
						if (choice.Hidden != undefined)
						{
							continue;
						}

						this.engine.addChoice(choice.Text, choice);
					}

					return;
				}
			}


			// Default behavior
			this.engine.show("&gt; "+choice.Text);

			if (choice.IsSpecial != undefined)
			{
				this.engine.gotoScene(SpecialLocation, choice.Target);
			}
			else
			{
				this.engine.gotoScene(Location, choice.Target);
			}
		}
		else
		{
			this.engine.gotoScene(End);
		}
	}
}

class End extends Scene {
	create() {
		this.engine.show("<hr>");
		this.engine.show(this.engine.storyData.Credits);
	}
}

Engine.load(Start, 'myStory.json');