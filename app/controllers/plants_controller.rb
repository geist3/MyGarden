class PlantsController < ApplicationController
  # GET /plants
  # GET /plants.xml
  def index
    @garden = Garden.find(params[:garden_id])
    @plants = @garden.plants(:order=> 'name')
  end

  # GET /plants/1
  # GET /plants/1.xml
  def show
    @plant = Plant.find(params[:id])
    render :action => "edit"
  end

  # GET /plants/new
  # GET /plants/new.xml
  def new
    @plant = Plant.new
  end

  # GET /plants/1/edit
  def edit
    @plant = Plant.find(params[:id])
  end

  # POST /plants
  # POST /plants.xml
  def create
    @garden = Garden.find(params[:garden_id])
    @plant = @garden.plants.new(params[:plant])

      if @plant.save
        flash[:notice] = 'Plant was successfully created.'
        redirect_to(:action => 'index')
      else
        render :action => "new"
      end
  end

  # PUT /plants/1
  # PUT /plants/1.xml
  def update
    @plant = Plant.find(params[:id])

      if @plant.update_attributes(params[:plant])
        flash[:notice] = 'Plant was successfully updated.'
        redirect_to(garden_plants_path(@plant.garden))
      else
        render :action => "edit"
      end
  end

  # DELETE /plants/1
  # DELETE /plants/1.xml
  def destroy
    @plant = Plant.find(params[:id])
    @garden = @plant.garden
    @plant.destroy
    redirect_to(garden_plants_path(@garden))
  end
end
