class TasksController < ApplicationController
  # GET /tasks
  def index
    @tasks = Task.find(:all)
  end

  # GET /tasks/1
  def show
    @task = Task.find(params[:id])
  end

  # GET /tasks/new
  def new
  	@plant = Plant.find(params[:plant_id])
    @task = Task.new
  end

  # GET /tasks/1/edit
  def edit
    @task = Task.find(params[:id])
  end

  # POST /tasks
  def create
    @plant = Plant.find(params[:plant_id])
    @task = @plant.tasks.new(params[:task])

    if @task.save
      flash[:notice] = 'Task was successfully created.'
      redirect_to(@plant)
    else
      render :action => "new" 
    end
  end

  # PUT /tasks/1
  def update
    @task = Task.find(params[:id])

    if @task.update_attributes(params[:task])
      flash[:notice] = 'Task was successfully updated.'
      redirect_to(@task.plant) 
    else
      render :action => "edit" 
    end
  end

  # DELETE /tasks/1
  def destroy
    @task = Task.find(params[:id])
  	@plant = @task.plant
  	@task.destroy

    redirect_to(@plant) 
  end
end
