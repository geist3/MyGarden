class LogentriesController < ApplicationController
  # GET /logentries
  def index
    @logentries = Logentry.find(:all)
  end

  # GET /logentries/1
  def show
    @logentry = Logentry.find(params[:id])
  end

  # GET /logentries/new
  def new
    @plant = Plant.find(params[:plant_id])
    @logentry = Logentry.new
  end

  # GET /logentries/1/edit
  def edit
    @logentry = Logentry.find(params[:id])
  end

  # POST /logentries
  def create
	@plant = Plant.find(params[:plant_id])
    @logentry = @plant.logentries.create(params[:logentry])

    if @logentry.save
      flash[:notice] = 'Logentry was successfully created.'
      redirect_to(@plant)
    else
      render :action => "new"
    end
  end

  # PUT /logentries/1
  def update
    @logentry = Logentry.find(params[:id])

    if @logentry.update_attributes(params[:logentry])
      flash[:notice] = 'Logentry was successfully updated.'
      redirect_to(@logentry.plant)
    else
      render :action => "edit" 
    end
  end

  # DELETE /logentries/1
  def destroy
    @logentry = Logentry.find(params[:id])
    @plant = @logentry.plant
    @logentry.destroy

    redirect_to(@plant)
  end
end
