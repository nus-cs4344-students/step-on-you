module.exports = function FixedQueue( size, initialValues ){

    // If there are no initial arguments, default it to
    // an empty value so we can call the constructor in
    // a uniform way.
    initialValues = (initialValues || []);

    // Create the fixed queue array value.
    this.queue = Array.apply( null, initialValues );

    // Store the fixed size in the queue.
    this.fixedSize = size;

    // Add the class methods to the queue. Some of these have
    // to override the native Array methods in order to make
    // sure the queue lenght is maintained.
    this.push = function(element){
     // Check to see if any trimming needs to be performed.
    
        if (this.queue.length >= this.fixedSize){
            // Trim whatever is beyond the fixed size.
            this.queue.splice(0,1);
        }
        this.queue.push(element);   
    }

};
